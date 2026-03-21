// 默认导出，提供统一的API访问入口

import { siteInfoApi, clientSiteInfoApi } from './siteInfo.api';
import { authorInfoApi, clientAuthorInfoApi } from './authorInfo.api';
import { fileApi } from './file.api';
import { categoryApi, clientCategoryApi } from './category.api';
import { articleApi, clientArticleApi } from './article.api';
import { adminUserApi, roleApi } from './user.api';
import { friendlyLinkApi, clientFriendlyLinkApi } from './friendlyLink.api';
import { leaveMessageApi, clientLeaveMessageApi } from './leaveMessage.api';
import { photoAlbumApi, clientPhotoAlbumApi } from './photoAlbum.api';
import { accessLogApi } from './accessLog.api';
import { tagApi } from './tag.api';
import { dashboardApi } from './dashboard.api';
import { captchaApi } from './captcha.api';

// 默认导出所有API
export default {
	// 管理端API
	admin: {
		siteInfo: siteInfoApi,
		file: fileApi,
		category: categoryApi,
		article: articleApi,
		user: adminUserApi,
		role: roleApi,
		friendlyLink: friendlyLinkApi,
		leaveMessage: leaveMessageApi,
		photoAlbum: photoAlbumApi,
		accessLog: accessLogApi,
		tag: tagApi,
		dashboard: dashboardApi,
	},
	// 客户端API
	client: {
		siteInfo: clientSiteInfoApi,
		authorInfo: clientAuthorInfoApi,
		category: clientCategoryApi,
		article: clientArticleApi,
		friendlyLink: clientFriendlyLinkApi,
		leaveMessage: clientLeaveMessageApi,
		photoAlbum: clientPhotoAlbumApi,
	},
	// 通用API
	captcha: captchaApi,
};
