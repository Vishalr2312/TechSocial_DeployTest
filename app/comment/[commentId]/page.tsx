import ChildCommentComp from "@/components/TechSocial/childComment/ChildCommentComp";

export default function CommentDetail({
  params,
}: {
  params: { commentId: string, postId: string };
}) {
  return <ChildCommentComp commentId={Number(params.commentId)} postId={Number(params.postId)} />;
}