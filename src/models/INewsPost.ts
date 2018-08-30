export interface INewsPost {
  postId?: number;
  author: number;
  title: string;
  message: string;
  created_at?: Date;
  updated_at?: Date;
}

export const newsPostFilter: (post: INewsPost) => INewsPost = (
  post: INewsPost
): INewsPost => post;
