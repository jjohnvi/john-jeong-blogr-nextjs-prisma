import React from "react";
import { GetServerSideProps } from "next";
import { useSession, getSession } from "next-auth/react";
import Layout from "../components/Layout";
import DraftPost, { PostProps } from "../components/DraftPost";
import prisma from "../lib/prisma";
import TextArea from "../components/TextArea";

/**
 * getServerSideProps only runs on server-side and never runs on the browser. If a page uses getServerSideProps then:
 * when you request this page directly, get serversideprops runs at request time, and this page will be pre-rendered with the returned props.
 * When you request this page on a client-side page transitions through next/link or next/router, Next.Js sends an API request to the server, which runs getServerSideProps.
 * getServerSideProps returns JSON which will be used to render the page.
 * getServerSidePropls can only be exported from a page, you can't export it from non-page files. You must export getServerSideProps as a standalone function -
 * it will not work if you add getServerSideProps as a property of the page component.
 *
 * Props will be passed to the page component and can be viewed on the client-side in the initial HTML. This is to allow the page to be hydrated correctly. Make sure that you don't pass
 * any sensitive information that shouldn't be available on the client in `props`.
 *
 * You should only use getServerSideProps only if you need to render a page whose data must be fetched at a request time.
 * Here, it's important because you need to be authorized first. If you're not authorized, there is no point in fetching the data.
 * If you do not need to render the data during the request, then fetching data on the client side or getStaticProps would probably be the better option.
 */

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  const drafts = await prisma.post.findMany({
    where: {
      author: { email: session.user.email },
    },
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { name: true, email: true, image: true },
      },
      _count: {
        select: { comments: true, likes: true },
      },
      likes: true,
    },
  });
  return {
    props: { drafts },
  };
};

type Props = {
  drafts: PostProps[];
};

// const Drafts: React.FC<Props> = (props) => {
const Drafts = (props: Props) => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Layout>
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">
        <main>
          <div className="hidden md:block">
            <TextArea />
          </div>
          {props.drafts.map((post) => (
            <div
              key={post.id}
              className="px-4 md:border-b-[1px] md:border-[#FFD8D8] md:px-5"
            >
              <DraftPost post={post} />
            </div>
          ))}
        </main>
      </div>
    </Layout>
  );
};

export default Drafts;
