import { AfterUserRecessedOrLeft } from './AfterUserRecessedOrLeft'
import { removeBelongingUserUsecase } from 'src/app/team'
// Subscribers
new AfterUserRecessedOrLeft(removeBelongingUserUsecase)
