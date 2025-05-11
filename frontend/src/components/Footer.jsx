const Footer = () => {
    const year = new Date().getFullYear();
    
    return (
      <footer className="footer">
        <div className="container">
          <p>&copy; {year} Blog App. All rights reserved.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;