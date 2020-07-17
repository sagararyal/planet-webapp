import Layout from '../src/features/common/Layout'
import dynamic from 'next/dynamic'
import React from 'react'
// var L = require('leaflet');
// var esri = require('esri-leaflet');
const SimpleExample = dynamic(
  () => import('../src/features/public/Donations/screens/Maps3'),
  { ssr: false }
)

export default function Mappage() {
  return (
    <Layout>
      <SimpleExample/>
    </Layout>
  )
}
