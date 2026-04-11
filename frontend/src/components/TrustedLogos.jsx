export default function TrustedLogos() {
  const companies = ["Coinbase", "Spotify", "Slack", "Dropbox", "Webflow"];

  return (
    <section className="text-center py-20">
      <p className="text-gray-400 mb-6">
        Trusted by 2000+ learners & communities
      </p>
      <div className="flex justify-center gap-12 text-gray-300">
        {companies.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
    </section>
  );
}
