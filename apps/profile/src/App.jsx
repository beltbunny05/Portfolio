import { profileDetails, technologies } from './profile.js';

function ProfileDetails() {
  return (
    <div className="profile-details">
      {profileDetails.map((detail) => (
        <div key={detail.label}>
          <span className="detail-label">{detail.label}</span>
          <span className="detail-value">
            {detail.lines.map((line) => (
              <span className="detail-line" key={line}>
                {line}
              </span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}

function TechnologyMarquee() {
  return (
    <div className="technology-marquee monospace" aria-hidden="true">
      <div>
        {[...technologies, ...technologies].map((technology, index) => (
          <span key={`${technology}-${index}`}>{technology}</span>
        ))}
      </div>
    </div>
  );
}

export default function ProfileApp() {
  return (
    <>
      <section className="container section-grid hero" aria-labelledby="profile-heading">
        <p className="section-index">
          <b>01</b> / Profile
        </p>
        <div>
          <p className="eyebrow">Software engineer · Java & JavaScript · Frontend & backend</p>
          <h1 id="profile-heading">
            <span className="headline-line">Solid architecture,</span>
            <span className="headline-line">
              <em>designed for people.</em>
            </span>
          </h1>
          <div className="hero-summary">
            <p className="profile-description">
              I build full-stack systems with layered architecture and clean engineering practices.
              My graphic design degree shapes how I think about structure and usability from the
              first decision.
            </p>
            <a className="text-link" href="#projects">
              View projects <span aria-hidden="true">↘</span>
            </a>
          </div>
        </div>
        <ProfileDetails />
      </section>
      <TechnologyMarquee />
    </>
  );
}
