
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '../../../@/components/ui/dialog'
import { Input } from '../../../@/components/ui/input';
import { Textarea } from '../../../@/components/ui/textarea';
import { Switch } from '../../../@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "../../../@/components/ui/select"
import { Button } from '../../../@/components/ui/button';
import { Loader2Icon, Sparkle } from 'lucide-react';
import { useState } from "react";
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import { useRouter } from 'next/navigation';

function AddNewCourseDialog({ children }) {

    const [loading, setLoading]=useState(false);
    const [formData, setFormData]=useState({
        nativeLanguage:'',
        targetLanguage:'',
        goal:'',
        interests:'',
        includeVideo:false,
        courseLength:1,
        level:''
      });
    const router=useRouter();

    //function to update field inside form fata
    const onHandleInputChange=(field, value)=>{
        setFormData(prev=>({
            ...prev,// keep old values
            [field]:value//update ONLY the field that was changes
        }));
        console.log(formData); //testing purposes
    }

    const onGenerate=async()=>{
        console.log(formData);
        const courseId=uuidv4();
        try{
        setLoading(true);

        const result = await axios.post('/api/generate-course-layout', {
            ...formData,
            courseId:courseId
        });
          
        console.log(result.data);
        setLoading(false);
        router.push('/workspace/edit-course/'+result.data?.courseId);

        }
        catch(e){
            setLoading(false)
            console.log(e)
        }
    }

  return (
    <Dialog>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Generate Your Personalized Language Course</DialogTitle>
            <DialogDescription asChild>
                <div className='flex flex-col gap-3 mt-3'>
                    <div>
                        <label>Native Language</label>
                        <Input placeholder="Ex: English" onChange={(event)=>onHandleInputChange('nativeLanguage', event?.target.value)}/>
                    </div>
                    <div>
                        <label>Target Language</label>
                        <Input placeholder="Ex: Japanese" onChange={(event)=>onHandleInputChange('targetLanguage', event?.target.value)}/>
                    </div>
                    <div>
                        <label>Goal (Optional)</label>
                        <Textarea placeholder="Ex: Be able to debate during work meetings" onChange={(event)=>onHandleInputChange('goal', event?.target.value)}/>
                    </div>
                    <div>
                        <label>Course Length</label>
                        <Input placeholder="Time/Duration Ex: 24 hours" type='number' onChange={(event)=>onHandleInputChange('courseLength', event?.target.value)}/>
                    </div>
                    {/* dont need*/}
                    <div className='flex gap-3 items-center'>
                        <label>Include Video</label>
                        <Switch onCheckedChange={()=>onHandleInputChange('interests', event?.target.value)}/>
                    </div>
                    <div>
                        <label>Difficulty Level</label>
                        <Select className='mt-1' onValueChange={(value)=>onHandleInputChange('level',value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Difficulty Level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="moderate">Moderate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label>Interests/Profession/Hobbies</label>
                        <Input placeholder="Ex: Lawyer, Soccer, Artist (Separated by comma)" onChange={(event)=>onHandleInputChange('category', event?.target.value)}/>
                    </div>

                    <div className='mt-5'>
                        <Button className={'w-full'} onClick={onGenerate} disabled={loading}> 
                            {loading?<Loader2Icon className='animate-spin'/>:
                            <Sparkle/>} Generate Course</Button>
                    </div>
                </div>
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}

export default AddNewCourseDialog