
import {getAllAuthor, getOneUser, login, reg} from '../Controllers/registerController.js'
import {addCategory,deleteCategory,getAllCategory, updateCategorey} from '../Controllers/Category.js';
import express from 'express';
import { AuthCheck } from '../Middlewares/Auth.js';
import { roleAdim } from '../Middlewares/IsRoleAdmin.js';
import { isAutheryjestion } from '../Middlewares/IsroleAuth.js';
const router = express.Router()

router.post('/register',reg)
router.post('/login',login)
router.get('/get-oneUser',AuthCheck,getOneUser);
router.get('/get-allAuthor',getAllAuthor);
router.get('/getCategory',getAllCategory);
router.post('/addCat',AuthCheck,roleAdim,addCategory);
router.delete('/deleteCat/:id',AuthCheck,roleAdim,deleteCategory);
router.put('/updateCat/:id',AuthCheck,roleAdim,updateCategorey)
export default router;