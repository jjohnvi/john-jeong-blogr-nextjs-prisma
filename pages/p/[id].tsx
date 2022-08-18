import React from "react";
import { GetServerSideProps } from "next";
import ReactMarkdown from "react-markdown";
import Router from "next/router";
import Layout from "../../components/Layout";
import { useSession } from "next-auth/react";
import prisma from "../../lib/prisma";

/**
 * this page used `getServerSideProps` (SSR) instead of `getStaticProps` (SSG).
 * This is because the data is dynamic, it depends on the `id` of the `Post` that's requested in the URL.
 * For example, the view on route `/p/42` displays the `Post` where the `id` is `42`.
 */

/**
 * in this function takes a parameter called params which comes from [id] which is the file name.
 * With the id is how we select which specific post we are updating. In this case, we are only making sure that the post has an author. If this exists, the post will be sent and available.
 * params comes from this component. This is a feature of Next.js
 */

/**
 * getServerSideProps and getStatisProps is only used on pages, not components.
 * Functional components are to be used in components.
 * Prop Types are also to be typed and defined in the page, not in the components.
 * Fetching data is to be done in the pages as well. Big decisions are done in the pages.
 * Deciding what type of information, getting information from prisma/database is done on pages.
 * Otherwise, next/typescript will throw an error.
 * Next.Js set it up so that file paths are how routing would work.
 *
 * So, since this file is named [id].tsx, in the url itself, will have a param.
 * This URL query is filled by the id of the post itself.
 *
 * This is a page.
 * this is a specific post.
 * Now we have access to ID.
 * Because the file name is in square brackets, it will show up as a key in `params`.
 * Now that we have the id, we tell prisma to find a post using this id.
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
      comments: {
        select: {
          content: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  post.comments[0].user.name;
  // console.log(post);
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

type PostProps = {
  id: string;
  title: string;
  author: {
    name: string;
    email: string;
  } | null;
  content: string;
  published: boolean;
  comments: Array<{
    content: string;
    user: {
      name: string;
    };
  }>;
};

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
        <h1>{props.comments[0].content}</h1>
        <p>{props.comments[0].user.name}</p>
        {/* TODO: create html for a comment */}
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
