import React from "react";
import "./globals.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Homestead Refined Materials</title>
      </head>
      <body>
        <Theme>{children}</Theme>
      </body>
    </html>
  );
}
