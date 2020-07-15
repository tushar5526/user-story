import React, { useState, useEffect } from 'react'
import Navigation from '../components/Navigation'
import { navigate } from '@reach/router'
import axios from 'axios'
import { apiURL } from '../config.json'

const Profile = (props) => {
  const { profileId } = props
  const [stories, setStories] = useState([])
  const [user, setUser] = useState('')

  const strip = (html) => {
    return html.replace(/<\s*[^>]*>/gi, '')
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
          user(id: "${profileId}") {
            profilePicture {
              url
            }
            Name
            Bio
            username
            Company
            Profession
            email
            LinkedIn
            Twitter
          }
        }
        `
        },
        {
          withCredentials: true
        }
      )
      setUser(response.data.data.user)
    }
    if (profileId) {
      fetchUserInfo()
    }
  }, [profileId])

  useEffect(() => {
    const fetchMyStories = async () => {
      const response = await axios.post(
        `${apiURL}/graphql`,
        {
          query: `query {
          user(id: "${profileId}") {
            feature_requests {
              id
              Title
              Description
              feature_requests_status {
                Status
              }
              Votes
              feature_request_comments {
                Comments
              }
            }
          }
        }`
        },
        {
          withCredentials: true
        }
      )
      setStories(response.data.data.user.feature_requests)
    }
    fetchMyStories()
  }, [profileId])

  return (
    <>
      <div className='base-wrapper'>
        <div className='base-container'>
          <Navigation />
          <div className='profile-content'>
            <div className='flex flex-column'>
              <div className='flex flex-row'>
                <div className='profile-picture-container'>
                  {user.profilePicture ? (
                    <img
                      className='profile-picture'
                      src={user.profilePicture.url}
                      alt='profile pic'
                    />
                  ) : (
                    <img
                      className='profile-picture'
                      src={require('../assets/images/default-user.png')}
                      alt='profile pic'
                    />
                  )}
                </div>
                <div className='basic-about'>
                  <div className='flex flex-row flex-space-between'>
                    <div className='about-element about-element-label'>
                      {' '}
                      Username:{' '}
                    </div>
                    <div className='about-element '> {user.username} </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-row'>
                <div className='profile-picture-container'>
                  <textarea
                    rows='6'
                    cols='17'
                    readOnly={true}
                    defaultValue={user.Bio}
                  ></textarea>
                </div>
                <div className='basic-about'>
                  <div className='flex flex-row flex-space-between'>
                    <div className='about-element about-element-label'>
                      {' '}
                      Name:{' '}
                    </div>
                    <div className='about-element '>
                      {' '}
                      {user.Name !== 'null' ? user.Name : ''}{' '}
                    </div>
                  </div>
                  <div className='flex flex-row flex-space-between'>
                    <div className='about-element about-element-label'>
                      {' '}
                      Profession:{' '}
                    </div>
                    <div className='about-element '>
                      {' '}
                      {user.Profession !== 'null' ? user.Profession : ''}{' '}
                    </div>
                  </div>
                  <div className='flex flex-row flex-space-between'>
                    <div className='about-element about-element-label'>
                      {' '}
                      Company/Institute:{' '}
                    </div>
                    <div className='about-element '>
                      {' '}
                      {user.Company !== 'null' ? user.Company : ''}{' '}
                    </div>
                  </div>
                  <div className='flex flex-row flex-space-between'>
                    <div className='about-element about-element-label'>
                      {' '}
                      LinkedIn:{' '}
                    </div>
                    <div className='about-element '>
                      {' '}
                      {user.Linkedin !== 'null' ? user.Linkedin : ''}{' '}
                    </div>
                  </div>
                  <div className='flex flex-row flex-space-between'>
                    <div className='about-element about-element-label'>
                      {' '}
                      Twitter:{' '}
                    </div>
                    <div className='about-element '>
                      {' '}
                      {user.Twitter !== 'null' ? user.Twitter : ''}{' '}
                    </div>
                  </div>
                </div>
              </div>
              {
                <div className='flex flex-column'>
                  {stories.length ? (
                    stories.map((request, key) => {
                      return (
                        <div
                          className='request'
                          key={key}
                          onClick={() => {
                            navigate(`/story/${request.id}`)
                          }}
                        >
                          <div className='request-content'>
                            <h4>{request.Title}</h4>
                            {strip(request.Description)}
                          </div>
                          <div className='icon-display'>
                            {request.Votes}
                            <i className='eos-icons'>thumb_up</i>
                          </div>
                          <div className='icon-display'>
                            {request.feature_request_comments.length}
                            <i className='eos-icons'>comment</i>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <h3>No stories from this user</h3>
                  )}
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
