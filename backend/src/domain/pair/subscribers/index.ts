import { AfterUserRecessedOrLeft } from './AfterUserRecessedOrLeft'
import { removeUserUsecase } from 'src/app/pair'

// Subscribers
new AfterUserRecessedOrLeft(removeUserUsecase)
