import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";

interface Props {
  mdxSource: MDXRemoteSerializeResult;
}

export default function MDXRender({ mdxSource }: Props) {
  return <MDXRemote {...mdxSource} />;
}
