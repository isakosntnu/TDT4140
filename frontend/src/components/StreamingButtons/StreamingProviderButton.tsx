import React from "react";
import DisneyPlusLogo from "../../images/disney_plus_logo.png";
import NetflixLogo from "../../images/netflix_logo.png";
import HBOLogo from "../../images/hbo_max_logo.png";

interface StreamingProviderButtonProps {
  type: "netflix" | "hbo" | "disney";
}

const StreamingProviderButton: React.FC<StreamingProviderButtonProps> = ({
  type,
}) => {
  const links = {
    netflix: "https://www.netflix.com/",
    hbo: "https://www.hbomax.com/",
    disney: "https://www.disneyplus.com/",
  };

  const logos = {
    netflix: NetflixLogo,
    hbo: HBOLogo,
    disney: DisneyPlusLogo,
  };

  return (
    <a href={links[type]} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', borderRadius: '50%', overflow: 'hidden', border: '2px solid #fff', backgroundColor: '#fff' }}>
      <img src={logos[type]} alt={`${type} logo`} style={{ width: '50px', height: '50px', display: 'block', objectFit: 'cover' }}/>
    </a>
  );
};

export default StreamingProviderButton;
