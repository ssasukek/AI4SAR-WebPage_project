"use client";
import Link from "next/link";
import { SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";

export default function Footer() {
  return (
    <footer className="bottom-layer">
      <div className="footer-content">
        <div className="footer-col">
          <h4>Resources</h4>
          <ul className="footer-links">
            <li>
              <Link href="/public/background">Project Background</Link>
            </li>
            <li>
              <Link href="/public/docs">Documentation</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Team Access</h4>
          <ul className="footer-links">
            <li>
              <Link href="/public/teams">View Members</Link>
            </li>

            <li>
              <SignedOut>
                <Link href="/public/login">Member Login &rarr;</Link>
              </SignedOut>

              <SignedIn>
                <SignOutButton>
                  <button type="button" className="footer-link-btn">
                    Sign Out &rarr;
                  </button>
                </SignOutButton>
              </SignedIn>
            </li>
          </ul>
        </div>
      </div>
      <div className="copyright">
        &copy; {new Date().getFullYear()} AI4SAR Project. All rights reserved.
      </div>
    </footer>
  );
}
