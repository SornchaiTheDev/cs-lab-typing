import "~/styles/globals.css";

export const metadata = {
  title: "CS LAB",
  description:
    "Programming Lab web application for Computer Science Kasetsart University",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
