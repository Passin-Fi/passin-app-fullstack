import { CryptoIcon } from 'crypto-icons/CryptoIcon';
import { BadgeCheckIcon } from 'lucide-react';
import Link from 'next/link';
import { Badge } from 'shadcn/badge';
import { Button } from 'shadcn/button';
import { Card, CardContent } from 'shadcn/card';
import { Input } from 'shadcn/input';

export const metadata = {
    title: 'Typography – Assets',
};

export default function TypographyAssetPage() {
    return (
        <main className="container mx-auto max-w-4xl px-4 py-8">
            <div className="glass-card ">
                <Link href="/" className="text-blue-500 underline mb-4 inline-block">
                    {'< Go Back Home'}
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
            </div>

            <div className="glass-card mt-8">
                <Button variant="default">Default Button</Button>
                <Button variant="outline" className="ml-2">
                    Outline Button
                </Button>
                <Button variant="secondary" className="ml-2">
                    Secondary Button
                </Button>
                <Button variant="destructive" className="ml-2">
                    Destructive Button
                </Button>
                <Button variant="ghost" className="ml-2">
                    Ghost Button
                </Button>
                <Button variant="link" className="ml-2">
                    Link Button
                </Button>
                <Button variant="default" size="sm" className="ml-2">
                    Small Button
                </Button>
                <Button variant="default" size="lg" className="ml-2">
                    Large Button
                </Button>
                <Button variant="default" size="icon" className="ml-2">
                    <CryptoIcon name="SOL" />
                </Button>
            </div>

            <div className="glass-card mt-8">
                <Badge>Default Badge</Badge>
                <Badge variant="secondary" className="ml-2">
                    Secondary Badge
                </Badge>
                <Badge variant="destructive" className="ml-2">
                    Destructive Badge
                </Badge>
                <Badge variant="outline" className="ml-2">
                    Outline Badge
                </Badge>
                <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
                    <BadgeCheckIcon />
                    Verified
                </Badge>
            </div>

            <div className="glass-card mt-6">
                <Input
                    placeholder="Type something..."
                    endAdornment={
                        <span className="flex items-center gap-1">
                            USDT <CryptoIcon name="USDT" />
                        </span>
                    }
                />
            </div>

            <div className="glass-card mt-6">
                <Input
                    placeholder="Type something..."
                    endAdornment={
                        <span className="flex items-center gap-1">
                            USDT <CryptoIcon name="USDT" />
                        </span>
                    }
                />
            </div>
        </main>
    );
}
