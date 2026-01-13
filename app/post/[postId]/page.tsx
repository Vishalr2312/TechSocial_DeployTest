// import Ts_PostDetailMain from "@/components/TechSocial/PostDetail/Ts_PostDetailMain";
// import CommentComp from "@/components/TechSocial/comment/CommentComp";

import CommentComp from "@/components/TechSocial/comment/CommentComp";

// export default function PostDetail() {
//   return <CommentComp />;
//   //  (<Ts_PostDetailMain postId={Number(params.postId)} />);
// }

export default function PostDetail({
  params,
}: {
  params: { postId: string };
}) {
  return <CommentComp postId={Number(params.postId)} />;
}
