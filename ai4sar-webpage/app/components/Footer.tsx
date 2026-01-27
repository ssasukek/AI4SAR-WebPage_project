import Link from "next/link";

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
              <Link href="/public/login" className="login-link">
                Member Login &rarr;
              </Link>
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
