import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from '../../store/store'
import { getReviews, reviewDetails, reviewState, updateReview, deleteReview } from "../../redux/reviewSlice"


import { Review } from '../../interfaces'

import './Dash.scss'
import DeleteReviewModal, { DeleteReviewFunction } from "./modal/DeleteReviewModal";
import UpdateReviewModal, { UpdateFunction } from "./modal/UpdateReviewModal";


const ReviewDashboard = () => {
  const reviews = useAppSelector(reviewDetails)
  const dispatch = useAppDispatch();


  useEffect(() => {
    if (reviews) {
      dispatch(getReviews())
    }

  }, [dispatch])


  const [isModalVisible, setIsModalVisible] = useState(false)// add

  const [isActive, setIsActive] = useState<boolean | undefined>(false)
  const [test, setTest] = useState<string | undefined>("")

  //activate modal
  const [updateId, setUpdateId] = useState("")
  const [isEditModalVisible, setEditModalVisible] = useState(false)
  const toggleEditModal = () => {
    setEditModalVisible(isEditModalVisible => !isEditModalVisible)
  }

  // //toggle add modal
  // const toggleModal = () => {
  //   setIsModalVisible(wasModalVisible => !wasModalVisible)
  // }

  //delete modal
  const [deleteId, setDeleteId] = useState("")
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
  const toggleDeleteModal = () => {
    setDeleteModalVisible(isDeleteModalVisible => !isDeleteModalVisible)
  }

  const onBackdropClick = () => {
    setIsModalVisible(false)
    setDeleteModalVisible(false)
    setEditModalVisible(false)
    // clear()
  }


  const onDeleteReview: DeleteReviewFunction = async (id: string) => {
    dispatch(deleteReview(id)).then((res) => {
      // initApp()
      onBackdropClick()
    })
  }


  const onUpdateReview: UpdateFunction = async (args: { id: string | undefined, isActive: boolean | undefined }) => {

    let isActiveValue = !args.isActive 
    let newArgs = { id: args.id, isActive: isActiveValue }
    dispatch(updateReview(newArgs)).then((res) => {
      dispatch(getReviews())
    })

  }

  return (
    <div className="wrapper">
      <table className='table table-dark '>
        <thead >
          <tr className='bg-dark'>
            <th scope="col">#</th>
            <th scope="col">MovieId</th>
            <th scope="col">UserID</th>
            <th scope="col">Review Content</th>
            <th scope="col">Rating</th>
            <th scope="col">Status</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {reviews ? (
            reviews.map((review, index) => {
              return (
                <tr key={review.id}>
                  <td>{index + 1}</td>
                  <td>{review.movieId}</td>
                  <td>{review.userId}</td>
                  <td>{review.description}</td>
                  <td>{review.rating}</td>
                  <td>{String(review.isActive)}</td>
                  <td>

                    <div className='form-outline form-white mb-4'>
                      <label className="switch"

                      >
                        {review.isActive == true ?

                          <input type="checkbox" defaultChecked
                            value={String(review.isActive)}
                            onClick={() => onUpdateReview({ id: review.id, isActive: review.isActive })}
                           
                          />
                          :

                          <input type="checkbox" 
                            value={String(review.isActive)}

                            onClick={() => onUpdateReview({ id: review.id, isActive: review.isActive })}

                          />
                          }

                       
                        <div className="slider"></div>
                      </label>
                    </div>


                  </td>
                  <td>


                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => { toggleDeleteModal(); setDeleteId(review.id!) }}
                    >Delete</button>

                  </td>
                </tr>
              )
            })
          ) : ""}
        </tbody>
      </table>

      <UpdateReviewModal
        onClose={onBackdropClick}
        isEditModalVisible={isEditModalVisible}
        onUpdateRequested={onUpdateReview}
        reviewId={updateId}
      />




      <DeleteReviewModal
        onClose={onBackdropClick}
        isDeleteModalVisible={isDeleteModalVisible}
        onDeleteReview={onDeleteReview}
        deleteId={deleteId}
      />


    </div>
  )
}

export default ReviewDashboard