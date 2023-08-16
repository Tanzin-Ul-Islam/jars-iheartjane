import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IoMdArrowDropdown } from 'react-icons/io';
import Input, { Select } from '../../components/Input';
import Button from '../../components/Button';

const Nav = ({ singleJob, jotTitle }) => {
  const router = useRouter();

  return (
    <div className=" d-flex justify-content-between align-items-center p-3 mt-5 rounded-2 nav-border _linear-bg ff-Soleil400">
      {router.pathname === '/career' ? (
        <div className="d-flex align-items-center">
          <a
            onClick={() => setOpen(!open)}
            className="d-flex align-items-center m-0 mx-3 cp"
          >
            Filter <IoMdArrowDropdown className="ms-3" />
          </a>
          <div className="tooltip-container">
            {open && (
              <div className="tooltips">
                <div className="tool">
                  <p>Looking for something more specific?</p>
                  <div className="d-flex gap-4">
                    <div className="d-flex flex-column w-50">
                      <label htmlFor="name" className="fw-bold">
                        City
                      </label>
                      <Select options={options} cls="px-3" />
                    </div>
                    <div className="d-flex flex-column w-50">
                      <label htmlFor="name" className="fw-bold">
                        State/Province
                      </label>
                      <Select options={options} cls="px-3" />
                    </div>
                  </div>
                  <div className="d-flex flex-column gap-2 w-50 pe-3">
                    <label htmlFor="name" className="fw-bold mt-2">
                      Employment Type
                    </label>
                    <Select options={options} cls="px-3" />
                  </div>
                  <div className="d-flex flex-column gap-2">
                    <label htmlFor="name" className="fw-bold mt-2">
                      Sort By
                    </label>
                    <Select options={options} cls="px-3" />
                  </div>
                  <div className="text-center">
                    <Button cls="w-75 mt-3">Search</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <input
            type="text"
            placeholder="Keywords"
            className="p-2 rounded-2 border-0 w-100 career-input"
          />
        </div>
      ) : singleJob ? (
        <h4 className="">{jotTitle}</h4>
      ) : (
        <h4 className="">Jobs by Location</h4>
      )}

      <div className="mx-auto mx-sm-0 mt-3 mt-sm-0">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.url}
            className="text-dark px-3 text-decoration-none link"
            style={{ borderRight: '2px dashed #333' }}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Nav;
const links = [
  {
    name: 'Jobs',
    url: '/jobs',
  },
  {
    name: 'Login',
    url: '/login',
  },
];
const options = ['Home', 'Cell', 'Work'];
