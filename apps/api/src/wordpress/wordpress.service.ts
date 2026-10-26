import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { ZTTeamHtmlCleanerService } from './html-cleaner.service';
import { ztteam_getStorageRoot } from '../common/ztteam_storage.util';

@Injectable()
export class ZTTeamWordpressService {
  private readonly logger = new Logger(ZTTeamWordpressService.name);
  private readonly encryptionKey: Buffer;

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly htmlCleaner: ZTTeamHtmlCleanerService,
  ) {
    const secret = process.env.JWT_SECRET || 'default-secret-key-32-chars-long!';
    this.encryptionKey = crypto.scryptSync(secret, 'salt', 32);
  }

  private ztteam_encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', this.encryptionKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  private ztteam_decrypt(encryptedText: string): string {
    if (!encryptedText) return '';
    const [ivHex, encrypted] = encryptedText.split(':');
    if (!ivHex || !encrypted) return encryptedText;

    /** 1. Thử giải mã với khóa cấu hình hiện tại */
    try {
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', this.encryptionKey, iv);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch {
      /** Tiếp tục thử với các khóa dự phòng */
    }

    /** 2. Thử giải mã với default secret key */
    try {
      const fallbackKey = crypto.scryptSync('default-secret-key-32-chars-long!', 'salt', 32);
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', fallbackKey, iv);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch {
      /** Tiếp tục thử với khóa production */
    }

    /** 3. Thử với key ZTREEL_SECRET_KEY_2026 */
    try {
      const fallbackKey2 = crypto.scryptSync('ZTREEL_SECRET_KEY_2026', 'salt', 32);
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipheriv('aes-256-cbc', fallbackKey2, iv);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (err: any) {
      this.logger.warn(`Decryption failed: ${err.message}.`);
      return encryptedText;
    }
  }

  /**
   * Helper thực hiện request đến WordPress REST API với cơ chế tự động fallback giữa /wp-json và ?rest_route=
   * Giúp hệ thống hoạt động 100% trên mọi cấu hình WordPress (cả Plain Permalinks lẫn Pretty Permalinks)
   */
  async ztteam_wpRequest(
    wpUrl: string,
    endpoint: string,
    method: 'GET' | 'POST' | 'DELETE' = 'GET',
    options: {
      headers?: Record<string, any>;
      params?: Record<string, any>;
      data?: any;
      timeout?: number;
    } = {}
  ): Promise<any> {
    const cleanUrl = wpUrl.replace(/\/$/, '');
    const cleanPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const timeout = options.timeout || 20000;

    const isValidJsonResponse = (data: any) => {
      if (data === null || data === undefined) return false;
      if (typeof data === 'string') {
        const trimmed = data.trim();
        return (trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'));
      }
      return typeof data === 'object';
    };

    /** Cách 1: Thử qua endpoint Pretty Permalinks: /wp-json/... */
    let primaryError: any = null;
    try {
      const fullUrl = `${cleanUrl}/wp-json${cleanPath}`;
      let res;
      if (method === 'GET') {
        res = await firstValueFrom(this.httpService.get(fullUrl, { headers: options.headers, params: options.params, timeout }));
      } else if (method === 'POST') {
        res = await firstValueFrom(this.httpService.post(fullUrl, options.data, { headers: options.headers, params: options.params, timeout }));
      } else if (method === 'DELETE') {
        res = await firstValueFrom(this.httpService.delete(fullUrl, { headers: options.headers, params: options.params, timeout }));
      }

      if (res && isValidJsonResponse(res.data)) {
        return res;
      }
      this.logger.debug(`[WordPress API] /wp-json returned non-JSON HTML for ${cleanPath}, falling back to ?rest_route=`);
    } catch (err: any) {
      primaryError = err;
      if (err.response?.status === 401 && err.response?.data?.code === 'rest_not_logged_in') {
        throw err;
      }
    }

    /** Cách 2: Fallback sang WordPress Core Route: ?rest_route=... (hoạt động trên 100% host) */
    try {
      const routeUrl = `${cleanUrl}/`;
      const combinedParams = { rest_route: cleanPath, ...(options.params || {}) };
      let res;
      if (method === 'GET') {
        res = await firstValueFrom(this.httpService.get(routeUrl, { headers: options.headers, params: combinedParams, timeout }));
      } else if (method === 'POST') {
        res = await firstValueFrom(this.httpService.post(routeUrl, options.data, { headers: options.headers, params: combinedParams, timeout }));
      } else if (method === 'DELETE') {
        try {
          res = await firstValueFrom(this.httpService.delete(routeUrl, { headers: options.headers, params: combinedParams, timeout }));
        } catch (delErr: any) {
          if (delErr.response?.status === 405) {
            res = await firstValueFrom(this.httpService.post(routeUrl, {}, {
              headers: { ...(options.headers || {}), 'X-HTTP-Method-Override': 'DELETE' },
              params: combinedParams,
              timeout
            }));
          } else {
            throw delErr;
          }
        }
      }

      if (res && isValidJsonResponse(res.data)) {
        return res;
      }
      throw new Error(`WordPress API returned HTML instead of JSON for ${cleanPath}`);
    } catch (fallbackErr: any) {
      throw fallbackErr || primaryError;
    }
  }

  async ztteam_testConnection(wpUrl: string, wpUsername: string, wpAppPassword: string) {
    try {
      const cleanUrl = wpUrl.replace(/\/$/, '');
      const authHeader = 'Basic ' + Buffer.from(`${wpUsername}:${wpAppPassword}`).toString('base64');

      const response = await this.ztteam_wpRequest(cleanUrl, '/wp/v2/users/me', 'GET', {
        headers: { Authorization: authHeader },
        timeout: 10000,
      });

      return { success: true, data: { id: response.data.id, name: response.data.name } };
    } catch (error: any) {
      this.logger.error('WordPress connection test failed', error.response?.data || error.message);
      throw new HttpException(
        error.response?.data?.message || error.message || 'Failed to connect to WordPress',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /** Pre-flight check: Xác thực trang WordPress đích trước khi gọi AI tạo ảnh tốn phí */
  async ztteam_verifySite(targetSiteId: string): Promise<boolean> {
    const site = await this.prisma.ztteam_target_sites.findUnique({ where: { id: targetSiteId } });
    if (!site) throw new HttpException(`Target site ${targetSiteId} not found`, HttpStatus.BAD_REQUEST);
    const decryptedPassword = this.ztteam_decrypt(site.wp_app_password_encrypted);
    await this.ztteam_testConnection(site.wp_url, site.wp_username, decryptedPassword);
    return true;
  }

  async ztteam_createTargetSite(userId: string, data: { wpUrl: string; wpUsername: string; wpAppPassword: string; isManual?: boolean; ga4PropertyId?: string }) {
    await this.ztteam_testConnection(data.wpUrl, data.wpUsername, data.wpAppPassword);

    return this.prisma.ztteam_target_sites.create({
      data: {
        owner_user_id: userId,
        wp_url: data.wpUrl,
        wp_username: data.wpUsername,
        wp_app_password_encrypted: this.ztteam_encrypt(data.wpAppPassword),
        status: 'active',
        is_manual: data.isManual ?? false,
        ga4_property_id: data.ga4PropertyId ? data.ga4PropertyId.trim() : null,
      }
    });
  }

  async ztteam_updateTargetSite(userId: string, siteId: string, data: { wpUrl: string; wpUsername: string; wpAppPassword?: string; isManual?: boolean; ga4PropertyId?: string }) {
    if (data.wpAppPassword) {
      await this.ztteam_testConnection(data.wpUrl, data.wpUsername, data.wpAppPassword);
    }

    const updateData: any = {
      wp_url: data.wpUrl,
      wp_username: data.wpUsername,
    };

    if (data.isManual !== undefined) {
      updateData.is_manual = data.isManual;
    }

    if (data.ga4PropertyId !== undefined) {
      updateData.ga4_property_id = data.ga4PropertyId ? data.ga4PropertyId.trim() : null;
    }

    if (data.wpAppPassword) {
      updateData.wp_app_password_encrypted = this.ztteam_encrypt(data.wpAppPassword);
    }

    return this.prisma.ztteam_target_sites.update({
      where: { id: siteId, owner_user_id: userId },
      data: updateData
    });
  }

  /** ZTTeam: Bật / Tắt nhanh chế độ Đăng Thủ Công cho Website WordPress đích */
  async ztteam_toggleSiteManual(userId: string, siteId: string, isManual: boolean) {
    const site = await this.prisma.ztteam_target_sites.findFirst({
      where: { id: siteId, owner_user_id: userId }
    });

    if (!site) {
      throw new HttpException('Website WordPress không tồn tại hoặc bạn không có quyền', HttpStatus.NOT_FOUND);
    }

    return this.prisma.ztteam_target_sites.update({
      where: { id: siteId },
      data: { is_manual: isManual }
    });
  }

  async ztteam_getTargetSites(userId: string) {
    return this.prisma.ztteam_target_sites.findMany({
      where: { owner_user_id: userId },
      select: {
        id: true,
        wp_url: true,
        wp_username: true,
        status: true,
        is_manual: true,
        created_at: true,
        updated_at: true,
        _count: {
          select: { crawl_sources: true }
        }
      }
    });
  }

  async ztteam_deleteTargetSite(userId: string, siteId: string) {
    return this.prisma.ztteam_target_sites.deleteMany({
      where: { id: siteId, owner_user_id: userId }
    });
  }

  ztteam_getAuthHeader(site: any): string {
    const wpAppPassword = this.ztteam_decrypt(site.wp_app_password_encrypted);
    return 'Basic ' + Buffer.from(`${site.wp_username}:${wpAppPassword}`).toString('base64');
  }

  async ztteam_uploadMedia(
    wpUrl: string,
    authHeader: string,
    buffer: Buffer,
    filename: string,
    mimeType: string
  ): Promise<{ id: number; source_url: string }> {
    try {
      const response = await this.ztteam_wpRequest(wpUrl, '/wp/v2/media', 'POST', {
        headers: {
          Authorization: authHeader,
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Type': mimeType
        },
        data: buffer,
        timeout: 30000
      });
      return {
        id: response.data.id,
        source_url: response.data.source_url
      };
    } catch (error: any) {
      this.logger.error(`Failed to upload media to WordPress at ${wpUrl}`, error.response?.data || error.message);
      throw error;
    }
  }

  async ztteam_deleteMedia(
    wpUrl: string,
    authHeader: string,
    mediaId: number
  ): Promise<boolean> {
    try {
      await this.ztteam_wpRequest(wpUrl, `/wp/v2/media/${mediaId}`, 'DELETE', {
        headers: { Authorization: authHeader },
        params: { force: 'true' }
      });
      this.logger.log(`Successfully deleted media #${mediaId} on WP`);
      return true;
    } catch (err: any) {
      this.logger.warn(`Failed to delete media #${mediaId} on WP: ${err.message}`);
      return false;
    }
  }

  async ztteam_updatePostFeaturedMedia(
    wpUrl: string,
    authHeader: string,
    postId: string | number,
    featuredMediaId: number
  ): Promise<boolean> {
    try {
      await this.ztteam_wpRequest(wpUrl, `/wp/v2/posts/${postId}`, 'POST', {
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json'
        },
        data: { featured_media: featuredMediaId }
      });
      this.logger.log(`Successfully updated WP post #${postId} with featured_media #${featuredMediaId}`);
      return true;
    } catch (err: any) {
      this.logger.warn(`Failed to update WP post #${postId} featured_media: ${err.message}`);
      return false;
    }
  }

  async ztteam_deletePost(
    wpUrl: string,
    authHeader: string,
    postId: string | number
  ): Promise<boolean> {
    try {
      await this.ztteam_wpRequest(wpUrl, `/wp/v2/posts/${postId}`, 'DELETE', {
        headers: { Authorization: authHeader },
        params: { force: 'true' }
      });
      this.logger.log(`Successfully deleted WP post #${postId}`);
      return true;
    } catch (err: any) {
      this.logger.warn(`Failed to delete WP post #${postId}: ${err.message}`);
      return false;
    }
  }

  async ztteam_createPost(siteId: string, data: { title: string; content: string; excerpt?: string; categories?: number[]; tags?: number[]; imageUrl?: string | null }) {
    const site = await this.prisma.ztteam_target_sites.findUnique({
      where: { id: siteId }
    });

    if (!site) {
      throw new HttpException('Target site not found', HttpStatus.NOT_FOUND);
    }

    const wpAppPassword = this.ztteam_decrypt(site.wp_app_password_encrypted);
    const authHeader = 'Basic ' + Buffer.from(`${site.wp_username}:${wpAppPassword}`).toString('base64');
    const cleanUrl = site.wp_url.replace(/\/$/, '');

    /** Clean HTML and Upload Images */
    let cleanContent = data.content;
    try {
      cleanContent = await this.htmlCleaner.ztteam_cleanHtmlAndUploadImages(
        data.content,
        async (buffer, filename, mimeType) => {
          const res = await this.ztteam_uploadMedia(cleanUrl, authHeader, buffer, filename, mimeType);
          return res.source_url;
        }
      );
    } catch (err: any) {
      this.logger.warn(`Failed to clean HTML or upload images: ${err.message}`);
      /** Fallback to original content if cleaner completely fails */
    }

    try {
      const payload: any = {
        title: data.title,
        content: cleanContent,
        status: 'publish',
      };
      if (data.excerpt) payload.excerpt = data.excerpt;
      if (data.categories && data.categories.length > 0) payload.categories = data.categories;
      if (data.tags && data.tags.length > 0) payload.tags = data.tags;

      /** Handle featured image (thumbnail) */
      if (data.imageUrl) {
        try {
          let buffer: Buffer;
          const ext = data.imageUrl.split('.').pop()?.split('?')[0] || 'png';

          if (data.imageUrl.startsWith('http://') || data.imageUrl.startsWith('https://')) {
            /** Download the image via HTTP */
            const imageRes = await firstValueFrom(
              this.httpService.get(data.imageUrl, {
                responseType: 'arraybuffer',
                timeout: 20000,
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
              })
            );
            buffer = Buffer.from(imageRes.data);
          } else {
            /** Read local image file from storage */
            let localFile: string;
            if (data.imageUrl.startsWith('/storage') || data.imageUrl.startsWith('storage')) {
              localFile = path.join(ztteam_getStorageRoot(), data.imageUrl.replace(/^\/?storage[/\\]?/, ''));
            } else if (fs.existsSync(data.imageUrl)) {
              localFile = data.imageUrl;
            } else {
              localFile = path.join(ztteam_getStorageRoot(), data.imageUrl.replace(/^[/\\]+/, ''));
            }
            if (!fs.existsSync(localFile)) {
              throw new Error(`Local image file not found: ${localFile}`);
            }
            buffer = fs.readFileSync(localFile);
          }

          const mimeType = ext.toLowerCase() === 'png' ? 'image/png' : ext.toLowerCase() === 'webp' ? 'image/webp' : 'image/jpeg';

          /** Upload to WP and set featured_media */
          const media = await this.ztteam_uploadMedia(cleanUrl, authHeader, buffer, `thumbnail_${Date.now()}.${ext}`, mimeType);
          if (media && media.id) {
            payload.featured_media = media.id;
            this.logger.log(`Successfully uploaded featured media to WP: Media ID ${media.id}`);
          }
        } catch (mediaErr: any) {
          this.logger.warn(`Failed to upload featured image for post: ${mediaErr.message}`);
        }
      }

      /** 1. Check if post with same title already exists */
      let existingPost: any = null;
      try {
        const searchResponse = await this.ztteam_wpRequest(cleanUrl, '/wp/v2/posts', 'GET', {
          headers: { Authorization: authHeader },
          params: { search: data.title }
        });
        const postsList = Array.isArray(searchResponse?.data) ? searchResponse.data : [];
        existingPost = postsList.find((p: any) => p?.title?.rendered === data.title || p?.title?.raw === data.title);
      } catch (searchErr: any) {
        this.logger.warn(`Could not verify existing post on WP (${searchErr.message}). Proceeding with post creation.`);
      }

      let response: any;
      if (existingPost && existingPost.id) {
        /** Update existing post */
        response = await this.ztteam_wpRequest(cleanUrl, `/wp/v2/posts/${existingPost.id}`, 'POST', {
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json'
          },
          data: payload
        });
      } else {
        /** Create new post */
        response = await this.ztteam_wpRequest(cleanUrl, '/wp/v2/posts', 'POST', {
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json'
          },
          data: payload
        });
      }

      return {
        id: response.data.id,
        url: response.data.link
      };
    } catch (error: any) {
      this.logger.error(`Failed to create post on WordPress at ${cleanUrl}`, error.response?.data || error.message);
      throw new HttpException(
        error.response?.data?.message || error.message || 'Failed to create post on WordPress',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async ztteam_getCategories(siteId: string, userId: string) {
    let site = await this.prisma.ztteam_target_sites.findFirst({
      where: { id: siteId, owner_user_id: userId }
    });
    if (!site) {
      site = await this.prisma.ztteam_target_sites.findUnique({ where: { id: siteId } });
    }

    if (!site) throw new HttpException('Website WordPress không tồn tại trong hệ thống', HttpStatus.NOT_FOUND);

    const appPassword = this.ztteam_decrypt(site.wp_app_password_encrypted);
    const authHeader = 'Basic ' + Buffer.from(`${site.wp_username}:${appPassword}`).toString('base64');
    let wpUrl = site.wp_url.replace(/\/$/, '');

    try {
      const response = await this.ztteam_wpRequest(wpUrl, '/wp/v2/categories', 'GET', {
        headers: { Authorization: authHeader },
        params: { per_page: 100 },
        timeout: 10000,
      });

      const list = Array.isArray(response?.data) ? response.data : [];
      return list.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        count: cat.count
      }));
    } catch (error: any) {
      this.logger.error('Failed to fetch categories from WordPress', error.response?.data || error.message);
      throw new HttpException('Lỗi khi lấy danh sách chuyên mục từ WordPress: ' + (error.response?.data?.message || error.message), HttpStatus.BAD_REQUEST);
    }
  }

  async ztteam_getTags(siteId: string, userId: string) {
    let site = await this.prisma.ztteam_target_sites.findFirst({
      where: { id: siteId, owner_user_id: userId }
    });
    if (!site) {
      site = await this.prisma.ztteam_target_sites.findUnique({ where: { id: siteId } });
    }

    if (!site) throw new HttpException('Website WordPress không tồn tại trong hệ thống', HttpStatus.NOT_FOUND);

    const appPassword = this.ztteam_decrypt(site.wp_app_password_encrypted);
    const authHeader = 'Basic ' + Buffer.from(`${site.wp_username}:${appPassword}`).toString('base64');
    let wpUrl = site.wp_url.replace(/\/$/, '');

    try {
      const response = await this.ztteam_wpRequest(wpUrl, '/wp/v2/tags', 'GET', {
        headers: { Authorization: authHeader },
        params: { per_page: 100 },
        timeout: 10000,
      });

      const list = Array.isArray(response?.data) ? response.data : [];
      return list.map((tag: any) => ({
        id: tag.id,
        name: tag.name,
        count: tag.count
      }));
    } catch (error: any) {
      this.logger.error('Failed to fetch tags from WordPress', error.response?.data || error.message);
      throw new HttpException('Lỗi khi lấy danh sách tag từ WordPress: ' + (error.response?.data?.message || error.message), HttpStatus.BAD_REQUEST);
    }
  }

  async ztteam_getPosts(siteId: string, userId: string, categoryId?: string, targetTags?: string) {
    let site = await this.prisma.ztteam_target_sites.findFirst({
      where: { id: siteId, owner_user_id: userId }
    });
    if (!site) {
      site = await this.prisma.ztteam_target_sites.findUnique({ where: { id: siteId } });
    }

    if (!site) throw new HttpException('Website WordPress không tồn tại trong hệ thống', HttpStatus.NOT_FOUND);

    const appPassword = this.ztteam_decrypt(site.wp_app_password_encrypted);
    const authHeader = 'Basic ' + Buffer.from(`${site.wp_username}:${appPassword}`).toString('base64');
    let wpUrl = site.wp_url.replace(/\/$/, '');

    try {
      const params: any = { per_page: 20, _embed: 1 };
      if (categoryId) params.categories = categoryId;
      if (targetTags) params.tags = targetTags;

      const response = await this.ztteam_wpRequest(wpUrl, '/wp/v2/posts', 'GET', {
        headers: { Authorization: authHeader },
        params,
        timeout: 12000,
      });

      const list = Array.isArray(response?.data) ? response.data : [];
      return list.map((p: any) => {
        const rawContent = p.content?.rendered || p.title?.rendered || '';
        const cleanContent = rawContent.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
        const rawExcerpt = p.excerpt?.rendered || cleanContent.substring(0, 180);
        const cleanExcerpt = rawExcerpt.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();

        /** Extract image URL */
        let imageUrl: string | null = null;
        if (p._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
          imageUrl = p._embedded['wp:featuredmedia'][0].source_url;
        } else {
          const imgMatch = p.content?.rendered?.match(/<img[^>]+(?:src|data-src)="([^"]+)"/i);
          if (imgMatch) imageUrl = imgMatch[1];
        }

        return {
          id: p.id,
          title: (p.title?.rendered || 'No Title').replace(/<[^>]*>?/gm, ''),
          date: p.date,
          link: p.link,
          content: cleanContent,
          excerpt: cleanExcerpt,
          imageUrl: imageUrl,
        };
      });
    } catch (e: any) {
      this.logger.error('Failed to get posts from WP', e.response?.data || e.message);
      throw new HttpException(
        'Không thể kết nối đến WordPress: ' + (e.response?.data?.message || e.message),
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async ztteam_getSamplePost(siteId: string, userId: string, categoryId?: string, targetTags?: string) {
    let site = await this.prisma.ztteam_target_sites.findFirst({
      where: { id: siteId, owner_user_id: userId }
    });
    if (!site) {
      site = await this.prisma.ztteam_target_sites.findUnique({ where: { id: siteId } });
    }

    if (!site) throw new HttpException('Website WordPress không tồn tại trong hệ thống', HttpStatus.NOT_FOUND);

    const appPassword = this.ztteam_decrypt(site.wp_app_password_encrypted);
    const authHeader = 'Basic ' + Buffer.from(`${site.wp_username}:${appPassword}`).toString('base64');
    let wpUrl = site.wp_url.replace(/\/$/, '');

    try {
      const params: any = { per_page: 1, _fields: 'id,title,content' };
      if (categoryId) params.categories = categoryId;
      if (targetTags) params.tags = targetTags;

      const response = await this.ztteam_wpRequest(wpUrl, '/wp/v2/posts', 'GET', {
        headers: { Authorization: authHeader },
        params,
        timeout: 10000,
      });

      const list = Array.isArray(response?.data) ? response.data : [];
      if (list.length > 0) {
        const post = list[0];
        /** Strip HTML from content */
        const rawContent = post.content?.rendered || post.title?.rendered || '';
        const cleanContent = rawContent.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
        return {
          id: post.id,
          title: post.title?.rendered,
          content: cleanContent
        };
      }
      return null;
    } catch (e: any) {
      this.logger.error('Failed to get sample post from WP', e.response?.data || e.message);
      return null;
    }
  }
}
