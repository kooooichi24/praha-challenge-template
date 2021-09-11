import { AfterUserRecessedOrLeft } from './AfterUserRecessedOrLeft'
import { addUserUsecase } from 'src/app/pair'

// Subscribers
new AfterUserRecessedOrLeft(addUserUsecase)
