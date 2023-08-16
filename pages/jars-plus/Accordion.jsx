import React from 'react';

const Accordion = ({ data }) => {
  return (
    <div>
      <div className="container accordion accordion-flush my-3">
        {data?.map((accordion, i) => (
          <div key={'ac'+i} className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed fw-bold ff-Soleil700"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#flush-collapse${accordion.id}`}
                aria-expanded="false"
                aria-controls={`flush-collapse${accordion.id}`}
              >
                {accordion.question}
              </button>
            </h2>
            <div
              id={`flush-collapse${accordion.id}`}
              className="accordion-collapse collapse"
              data-bs-parent="#accordionFlushExample"
            >
              <div className="accordion-body text-start ff-Soleil400">
                {accordion.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accordion;
