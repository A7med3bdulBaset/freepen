import { useEffect, useState, memo } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../firebase-config";
import { Blog, UserInfoProps } from "../TYPES";
import Markdown from "react-markdown";
import { CiCalendarDate, CiHeart, CiRead } from "react-icons/ci";
import { BsShare } from "react-icons/bs";
import Button from "../components/Button";
import { Loading } from "./../App";

function BlogDetails() {
	const { id } = useParams();
	const [blog, setBlog] = useState<Blog | null>(null);
	const [author, setAuthor] = useState<UserInfoProps | null>(null);
	// const [error, setError] = useState("");

	document.title = `FreePen ${blog?.title}`;

	useEffect(() => {
		(async () => {
			try {
				const docRef = doc(collection(db, "blogs"), id);
				const blogSnapshoot = await getDoc(docRef);

				if (!blogSnapshoot.exists()) return; // setError("No such document!");

				setBlog(() => blogSnapshoot.data() as Blog);

				const authorRef = doc(db, "users", blogSnapshoot.data().authorId);
				const authorSnapshoot = await getDoc(authorRef);

				if (!authorSnapshoot.exists()) return; // setError("No such document!");
				setAuthor(() => authorSnapshoot.data() as UserInfoProps);
			} catch (error: any) {
				// setError(error?.message);
				// console.error(error);
			}
		})();
	}, []);

	if (!blog) return <Loading />;

	let w = window.innerWidth;

	return (
		<div className="container flex h-full flex-col md:flex-row">
			{/* The Main Content */}
			<main className="flex-auto space-y-2 py-4">
				{/* Header => Headeing + Image */}
				<header className="space-y-3">
					<h1 className="text-2xl font-semibold md:text-5xl">
						{blog.title}
					</h1>
					<p className="flex items-center gap-2 text-sm font-light opacity-70">
						<CiCalendarDate /> Written at{" "}
						{blog.blogInfo.createdAt.toDate().toDateString()}
					</p>
					<img
						src={blog.image}
						className="object-fit object center h-auto max-h-screen w-full rounded shadow"
						alt={blog.title}
					/>
					<h1>{w}</h1>
				</header>
				<div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
					{/* Author Info */}
					{author && (
						<section className="flex items-center justify-between gap-3 rounded bg-slate-50 p-2 dark:bg-slate-900">
							<img
								src={author?.photoURL.toString()}
								className="h-10 w-10 rounded-2xl object-cover md:h-16 md:w-16"
								alt={author?.photoURL.toString()}
							/>
							<div className="flex-auto">
								<h2 className="font-medium md:text-2xl">
									{author?.name}
								</h2>
								<p className="text-xs opacity-60 md:text-sm">
									{author.subTitle}
								</p>
							</div>
							<Button variant="primary" className="rounded-full text-xs px-2 py-1">
								Follow
							</Button>
						</section>
					)}
					{/* Blog Reactions */}
					<section className="flex flex-wrap gap-4 divide-x-2 divide-dashed divide-slate-400/50 py-4">
						<div className="flex flex-auto items-center justify-center gap-4 p-4 text-center">
							<span className="md:text-3xl">
								<CiRead />
							</span>
							<span className="opacity-70">
								{blog.blogInfo.readsCount}
							</span>
						</div>
						<div className="flex flex-auto items-center justify-center gap-4 p-4 text-center">
							<span className="md:text-3xl">
								<CiHeart />
							</span>
							<span className="opacity-70">
								{blog.blogInfo.likesCount}
							</span>
						</div>
						<div className="flex flex-auto items-center justify-center gap-4 p-4 text-center">
							<span className="md:text-3xl">
								<BsShare />
							</span>
							<span className="opacity-70">
								{blog.blogInfo.sharesCount}
							</span>
						</div>
					</section>
				</div>
				{/* Blog Body */}
				<article className="[&,_&_*]:!break-words prose py-4 px-1 dark:prose-invert">
					{blog.body && <Markdown>{blog?.body}</Markdown>}
				</article>
			</main>
			{/* The Sidebar */}
			<aside className="w-full md:w-80">
				<div className="sticky top-4"></div>
			</aside>
		</div>
	);
}

export default memo(BlogDetails);