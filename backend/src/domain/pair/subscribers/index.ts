import { AfterUserRecessedOrLeft } from './AfterUserRecessedOrLeft'
import { removeBelongingUserUsecase } from 'src/app/pair'

// Subscribers
new AfterUserRecessedOrLeft(removeBelongingUserUsecase)
