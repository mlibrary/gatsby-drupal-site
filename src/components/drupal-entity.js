import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import MediaPlayer from './media-player'
import Image from './image'
import Link from './link'

export default function DrupalEntity(props) {
  const data = useStaticQuery(
    graphql`
      query {
        allMediaRemoteVideo {
          edges {
            node {
              drupal_id
              field_media_oembed_video
            }
          }
        }
        allMediaFile {
          edges {
            node {
              drupal_id
              name
              relationships {
                field_media_file {
                  filemime
                  localFile {
                    publicURL
                  }
                }
              }
            }
          }
        }
        allMediaImage(
          filter: {
            relationships: {
              field_media_image: { localFile: { extension: { eq: "jpg" } } }
            }
          }
        ) {
          edges {
            node {
              drupal_id
              relationships {
                field_media_image {
                  localFile {
                    childImageSharp {
                      fluid(maxWidth: 920) {
                        ...GatsbyImageSharpFluid_noBase64
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `
  )

  const videoNode = data.allMediaRemoteVideo.edges.find(
    edge => edge.node.drupal_id === props['data-entity-uuid']
  )
  const videoUrl = videoNode?.node?.field_media_oembed_video
  if (videoUrl) {
    return <MediaPlayer url={videoUrl} />
  }

  const mediaImageNode = data.allMediaImage.edges.find(
    edge => edge.node.drupal_id === props['data-entity-uuid']
  )
  const mediaImage =
    mediaImageNode?.node?.relationships?.field_media_image?.localFile
      ?.childImageSharp?.fluid
  if (mediaImage) {
    return (
      <div css={{ maxWidth: '38rem' }}>
        <Image image={mediaImage} />
      </div>
    )
  }

  const fileNode = data.allMediaFile.edges.find(
    edge => edge.node.drupal_id === props['data-entity-uuid']
  )
  if (fileNode) {
    const file = fileNode?.node?.relationships?.field_media_file
    const to = file.localFile?.publicURL
    const fileType = file?.filemime === 'application/pdf' ? ' (PDF)' : ''
    const label = fileNode?.node?.name + fileType

    if (!to || !label) {
      return null
    }

    return <Link to={to}>{label}</Link>
  }

  return null
}
