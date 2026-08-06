/**
 * CHS 首页/健康宣教 API（apiPlugin 约定：export default ({ $post }) => ({ ... })）
 */
import { CONTEXT } from '@/utils/http-context';

export default ({ $post }: any) => ({
  /** 获取主页排版数据 */
  queryHomeData: (params: any) => $post(`${CONTEXT}/resident/homePage/list`, params),
  /** 获取文章分页 */
  queryArticlePage: (params: any) => $post(`${CONTEXT}/resident/healthEduCate/page`, params),
  /** 获取文章详情 */
  queryArticleData: (id: string) => $post(`${CONTEXT}/resident/healthEduCate/qryById/${id}`),
  /** 文章点赞/取消点赞 */
  articleLikes: (params: any) => $post(`${CONTEXT}/resident/healthEduCate/thumbOrCancel`, params),
  /** 查询居民是否点赞 0否1是 */
  queryUserIsLike: (params: any) => $post(`${CONTEXT}/resident/healthEduCate/thumbStatusValid`, params),
  /** 浏览数增加 */
  articleViews: (id: string) => $post(`${CONTEXT}/resident/healthEduCate/viewsNum/add/${id}`),
  /** 转发数增加 */
  articleShares: (id: string) => $post(`${CONTEXT}/resident/healthEduCate/forwardNum/add/${id}`),
});
