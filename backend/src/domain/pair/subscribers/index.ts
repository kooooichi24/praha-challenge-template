import { AfterUserRecessedOrLeft } from './AfterUserRecessedOrLeft'
import { AfterUserReturned } from './afterUserReturned'
import { removeBelongingUserUsecase } from 'src/app/pair'
import { addBelongingUserUsecase } from 'src/app/pair'

// Subscribers
new AfterUserRecessedOrLeft(removeBelongingUserUsecase)
new AfterUserReturned(addBelongingUserUsecase)
