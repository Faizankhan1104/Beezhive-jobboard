import React from 'react'
import './Home.css'
import {BsMortarboardFill} from 'react-icons/bs'
import {RiTeamFill} from 'react-icons/ri'
import {FaUserTie} from 'react-icons/fa'

const Home = () => {
  return (
    <>
      <section className='mainSection1'>
        <div>
          <h3 >Welcome to Beeshive</h3>
          <h1 className=' text-warning'>Find Tech jobs<br />
            across the US</h1>
          <h4>Over 1000+ job postings every day</h4>
          <h7 className=' text-secondary' >Register to receive all relevant jobs directly to your email</h7>
        </div>
        <div className='jobimg'>
          <img  src="https://png.pngtree.com/png-vector/20191122/ourmid/pngtree-recruitment-concept-of-job-search-flat-vector-with-people-workers-business-png-image_2018509.jpg" alt='this is a image' />
        </div>
      </section>
      <section>
        <div className='secHeading'><h2>How it works?</h2></div>
        <div className='rowContainer'>
          <div className='column'>
            <div className='icon-container'><span><BsMortarboardFill className='icon'/></span></div>
            <div className='details'>
              <h3>Job Seeker</h3>
              <p>Register with Beeshive<br />
              Add your Resume and Skills
							 <br />
                Get all relevant jobs directly to your email
							 <br/>
                Also view and apply jobs on portal
                </p>
            </div>
          </div>

          <div className='column'>
          <div className='icon-container'><span><RiTeamFill className='icon'/></span></div>
            <div className='details'>
              <h3>Banch Sales</h3>
              <p>Register with Beeshive<br />
              Add any number of consultants and their skills
							 <br />
                Get all relevant jobs directly to your email
							 <br/>
                Also view and apply jobs on portal
							</p>
            </div>
          </div>
          <div className='column'>
          <div className='icon-container'><span><FaUserTie className='icon'/></span></div>
            <div className='details'>
              <h3>Employer</h3>
              <p>Register with Beeshive	<br />
              Post unlimited free jobs <br />
                Seemless posting through email<br/>
                Your job is directly sent to relevant inbox 
							 </p>
            </div>
          </div>
        </div>

      </section>
    </>
  )
}

export default Home