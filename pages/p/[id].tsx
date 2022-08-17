import React from "react";
import { GetServerSideProps } from "next";
import ReactMarkdown from "react-markdown";
import Router from "next/router";
import Layout from "../../components/Layout";
import { PostProps } from "../../components/Post";
import { useSession } from "next-auth/react";
import prisma from "../../lib/prisma";

/**
 * this page used `getServerSideProps` (SSR) instead of `getStaticProps` (SSG).
 * This is because the data is dynamic, it depends on the `id` of the `Post` that's requested in the URL.
 * For example, the view on route `/p/42` displays the `Post` where the `id` is `42`.
 */

/**
 * in this function takes a parameter called params which comes from prisma.
 * With the id that comes in prisma is how we select which specific post we are updating. In this case, we are only making sure that the post has an author. If this exists, the post will be sent and available.
 * params comes from this component. This is a feature of Next.js
 */

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
  console.log(post);
  return {
    props: post,
  };
};

/**
 * in Publishpost(), takes in a parameter of ID that we use to edit the specific post
 */

async function publishPost(id: string): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: "PUT",
  });
  await Router.push("/");
}

async function deletePost(id: string): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: "DELETE",
  });
  Router.push("/");
}

const Post: React.FC<PostProps> = (props) => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div>Authenticating ...</div>;
  }
  const userHasValidSession = Boolean(session);
  const postBelongsToUser = session?.user?.email === props.author?.email;
  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }

  // console.log(session);
  // console.log(props);

  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {props?.author?.name || "Unknown author"}</p>
        <ReactMarkdown children={props.content} />
        {!props.published && userHasValidSession && postBelongsToUser && (
          <button onClick={() => publishPost(props.id)}>Publish</button>
        )}
        {userHasValidSession && postBelongsToUser && (
          <button onClick={() => deletePost(props.id)}>Delete</button>
        )}
      </div>
      <style jsx>{`
        .page {
          background: var(--geist-background);
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Post;
