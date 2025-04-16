const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Idea Incubator</h3>
            <p>Share and discover innovative ideas</p>
          </div>

          <div className="footer-section">
            <h3>Links</h3>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Connect</h3>
            <div className="social-links">
              <a href="#" aria-label="Twitter">
                Twitter
              </a>
              <a href="#" aria-label="GitHub">
                GitHub
              </a>
              <a href="#" aria-label="LinkedIn">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Idea Incubator. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
