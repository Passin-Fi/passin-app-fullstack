import Link from "next/link";

export const metadata = {
    title: "Typography – Assets",
};

export default function TypographyAssetPage() {
    return (
        <main className="container mx-auto max-w-4xl px-4 py-8">
            <Link href="/" className="text-blue-500 underline mb-4 inline-block">
                {"< Go Back Home"}
            </Link>

            <h1>h1: Hello World</h1>
            <h2>h2: Hello World</h2>
            <h3>h3: Hello World</h3>
            <h4>h4: Hello World</h4>
            <h5>h5: Hello World</h5>
            <h6>h6: Hello World</h6>
            <p>p: This is a paragraph.</p>
            <p className="lead">.lead: This is a lead paragraph.</p>
            <p className="muted">.muted: This is muted text.</p>
            <p className="caption">.caption: This is caption text.</p>
            <p className="overline">.overline: THIS IS OVERLINE TEXT</p>
            <blockquote className="blockquote">.blockquote: This is a blockquote.</blockquote>
            <pre className="code">.code: const example = "This is code";</pre>
        </main>
    );
}
