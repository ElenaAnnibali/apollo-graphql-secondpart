import { css } from '@emotion/react';
import Link from 'next/link';

const headerStyles = css`
  padding: 8px 14px;
  background: #fff1ad;
  border-radius: 6px;
  display: flex;
  justify-content: right;
  gap: 20px;
  font-size: 20px;
  padding-right: 20px;

  a {
    text-decoration: none;
    color: #2e0800;
    margin-right: 20px;
  }
`;

export default function Header() {
  return (
    <header>
      <div css={headerStyles}>
        <Link href="/">Home </Link>
        <Link href="/register">Register</Link>
        <Link href="/login">Login</Link>

        {/*
          This is how Next.js used to require
          links to be
          <Link href="/about">
            <a>About</a>
          </Link>
        */}
      </div>
    </header>
  );
}
