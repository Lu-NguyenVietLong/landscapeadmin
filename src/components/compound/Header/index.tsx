import Container from '@/components/primitive/Container'
import { MENU } from '@/utils/routes'
import { map } from 'lodash'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Header = () => {
  return (
    <section className='shadow-default size-full p-5 bg-white rounded-l-[32px]'>
        <Link href="/">
          <div className="text-primary font-bold text-xl">Landscape Admin</div>
        </Link>
        <ul className='mt-50px pl-4'>
          {map(MENU, (item, index) => (
          <li>
          <Link className='px-2 py-3 block font-semibold' href={item.route}>
            {item.title}
          </Link>
        </li>
          ))}
        </ul>
    </section>
  )
}

export default Header