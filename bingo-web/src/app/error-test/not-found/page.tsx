import { notFound } from 'next/navigation'

export default function Test(){
    console.log('not-found')
    return notFound()

}
