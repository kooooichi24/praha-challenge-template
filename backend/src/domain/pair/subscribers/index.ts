import { AfterUserRecessedOrLeft } from './AfterUserRecessedOrLeft'
import {
  moveBelongingUserUsecase,
  removeBelongingUserUsecase,
} from 'src/app/pair'
import { AfterBelongingUserRemoved } from './afterBelongingUserRemoved'

// Subscribers
new AfterUserRecessedOrLeft(removeBelongingUserUsecase)
new AfterBelongingUserRemoved(moveBelongingUserUsecase)
