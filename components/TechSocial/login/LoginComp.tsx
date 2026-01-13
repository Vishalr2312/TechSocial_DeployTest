'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import logo from '@/public/images/TechSocial/logo_1.png';

const LoginComp = () => {
  const handleSignUpClick = () => {
    console.log('Sign up clicked');
  };

  const handleSignInClick = () => {
    console.log('Sign in clicked');
  };
  return (
    <>
      <div className="login-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 text-center">
              {/* Logo Section */}
              <Link href="/" className="navbar-brand">
                <Image
                  src={logo}
                  className="img-fluid"
                  alt="#"
                  width={3000}
                  height={80}
                  priority
                />
              </Link>

              {/* Heading Section */}
              <div className="heading-wrapper mb-10 mt-8">
                <h1 className="fw-bold text-white mb-7">Happening now</h1>
                <h2 className="fw-bold text-white mb-4">Join today.</h2>
              </div>

              {/* Button Section */}
              <div className="button-wrapper d-flex flex-column align-items-center">
                <div className="btn-container">
                  <button
                    className="btn-create btn fw-bold text-white rounded-pill w-100 mb-3 shadow"
                    onClick={handleSignUpClick}
                    data-bs-toggle="modal"
                    data-bs-target="#goTsRegistrationModal"
                  >
                    Create account
                  </button>

                  <div className="or-text fw-medium my-3">OR</div>

                  <button
                    className="btn-signin btn fw-bold text-white rounded-pill w-100 mb-4 shadow"
                    onClick={handleSignInClick}
                    data-bs-toggle="modal"
                    data-bs-target="#goTsLoginMod"
                    role="modal"
                  >
                    Sign in
                  </button>
                </div>
              </div>

              {/* Terms Section */}
              <div className="terms small">
                By signing up, you agree to the{' '}
                <a href="#" className="text-decoration-none">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-decoration-none">
                  Privacy Policy
                </a>
                , including Cookie Use.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginComp;
