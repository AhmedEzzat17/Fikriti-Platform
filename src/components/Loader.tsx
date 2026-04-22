import React, { useEffect, useState } from "react";

const Loader: React.FC = () => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHidden(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="loader" className={`loader-dots ${hidden ? "bg-hidden" : ""}`}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default Loader;
