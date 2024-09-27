import "@fortawesome/fontawesome-free/css/all.min.css";
import "../styles/globals.css";

const Footer = () => {
  return (
    <footer className="bg-white text-white pt-10 pb-8 min-h-44 px-20">
      <div className="container mx-auto h-full relative max-w-about">
        {/* Top section with links and social icons */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          {/* Quick Links */}
          <div className="flex space-x-6">
            <a
              href="/about"
              className="text-footer hover:text-footerHover footText"
            >
              About
            </a>
            <a href="#" className="text-footer hover:text-footerHover footText">
              Contact
            </a>
            <a href="#" className="text-footer hover:text-footerHover footText">
              Privacy
            </a>
            <a href="#" className="text-footer hover:text-footerHover footText">
              Terms
            </a>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <a href="#" className="text-footer hover:text-footerHover footText">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="text-footer hover:text-footerHover footText">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-footer hover:text-footerHover footText">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-footer hover:text-footerHover footText">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="border-t border-gray-300 pt-6 text-right w-full">
          <p className="text-footer footText">
            &copy; {new Date().getFullYear()} Clear Health. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
