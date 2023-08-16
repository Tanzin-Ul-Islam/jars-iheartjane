import Link from 'next/link';
import React from 'react';

const JobList = () => {
  return (
    <div className="row mt-2 mb-5">
      <div className="col-md-8">
        <h4 className="pt-4 fw-bold ff-Soleil700">
          Current Job Listing 32 Total Jobs
        </h4>
        <p className="py-3 m-0 border-2 border-bottom border-dark ff-Soleil400">
          Below is a List of the Current openings with out company. Click on the
          job title to learn more about the opening
        </p>
        {jobList.map((job, i) => (
          <Link href="/career/job" key={i}>
            <div className="border-2 border-dark border-bottom pt-3">
              <h5 className="fw-bold ff-Soleil700">{job.title}</h5>
              <p className="ff-Soleil400">{job.location}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="col-md-4 mt-5">
        <div className="border border-dark rounded-2">
          <h6 className="fw-bold px-2 py-1 ff-Soleil700">Resources</h6>
          <Link href="/career/jobsByLocation">
            <p className="m-0 p-2 border border-dark rounded-2 _linear-bg ff-Soleil400">
              &gt; Jobs by Location
            </p>
          </Link>
        </div>
        <div className="border border-dark rounded-2 mt-4">
          <h6 className="fw-bold px-2 py-1 ff-Soleil700">Share This Page</h6>
          <p className="m-0 p-2 border border-dark rounded-2 _linear-bg ff-Soleil400">
            &gt; Jobs by Location
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobList;
const jobList = [
  {
    title: 'Delivery Dispatcher',
    location: 'Troy. MI, USA | Full Time',
  },
  {
    title: 'Delivery Driver / Curbside Specialist',
    location: 'Troy. MI, USA | Full Time',
  },
  {
    title: 'General Manager',
    location: 'Troy. MI, USA | Full Time',
  },
  {
    title: 'Inventory Lead',
    location: 'Troy. MI, USA | Full Time',
  },
  {
    title: 'Inventory Lead',
    location: 'Troy. MI, USA | Full Time',
  },
];
