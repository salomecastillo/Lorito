import Image from 'next/image'
import React from 'react'

function WelcomeBanner() {
  return (
    <div>
      <div className='p-5 gradient-warm from-blue-600 via-indigo-600 to-pink-500 rounded-xl'>
          <h2 className='font-bold text-2xl text-white'>Welcome to Lorito</h2>
          <p className='text-white'> Learn, Create, and Explore the languages you desire</p>
          <div>
            <Image src={'/parrot.png'} alt='Parrot' width={200} height={200}/>
          </div>
        </div>
    </div>
  )
}

export default WelcomeBanner