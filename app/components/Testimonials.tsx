import type { Testimonial } from "../../content/testimonials";

export function Testimonials({
  items,
  title = "Trusted by people building what comes next.",
  intro = "Feedback from founders, directors, and business teams across development, search, commerce, and digital growth.",
}: {
  items: Testimonial[];
  title?: string;
  intro?: string;
}) {
  return (
    <section className="section testimonials-section" id="testimonials">
      <div className="container">
        <div className="section-heading testimonials-heading">
          <div>
            <p className="eyebrow"><span /> Client feedback</p>
            <h2>{title}</h2>
          </div>
          <p>{intro}</p>
        </div>

        <div className="testimonial-grid">
          {items.map((testimonial) => (
            <figure className="testimonial-card" key={`${testimonial.name}-${testimonial.company}`}>
              <div className="testimonial-topline">
                <span className="testimonial-stars" aria-label="5 out of 5 stars">★★★★★</span>
                <span>Client review</span>
              </div>
              <blockquote>“{testimonial.quote}”</blockquote>
              <figcaption>
                <span className="testimonial-avatar" aria-hidden="true">
                  {testimonial.name.charAt(0)}
                </span>
                <div>
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role} · {testimonial.company}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
