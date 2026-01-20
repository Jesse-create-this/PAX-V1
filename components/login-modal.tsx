"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

interface LoginModalProps {
  onClose: () => void
  onLogin: (data: any) => void
  onOpenChange: (open: boolean) => void
}

export default function LoginModal({ onClose, onLogin, onOpenChange }: LoginModalProps) {
  const [formData, setFormData] = useState({
    marticNumber: "",
    password: "",
    yearOfStudy: "",
    semester: "",
    email: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      formData.marticNumber &&
      formData.password &&
      formData.yearOfStudy &&
      formData.semester &&
      formData.email
    ) {
      onLogin({
        ...formData,
        name: "John Okonkwo",
        part: "I",
        yearOfGraduation: "2024",
        department: "Computer Science",
        faculty: "Science",
        degreeProgram: "B.Sc Computer Science",
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">Login</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm font-semibold text-black">Martic Number</Label>
            <Input
              value={formData.marticNumber}
              onChange={(e) =>
                setFormData({ ...formData, marticNumber: e.target.value })
              }
              placeholder="e.g. MAT/2021/001"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-black">Password</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter password"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-semibold text-black">Year of Study</Label>
            <Select
              value={formData.yearOfStudy}
              onValueChange={(value) =>
                setFormData({ ...formData, yearOfStudy: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100">100 Level</SelectItem>
                <SelectItem value="200">200 Level</SelectItem>
                <SelectItem value="300">300 Level</SelectItem>
                <SelectItem value="400">400 Level</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-semibold text-black">Semester</Label>
            <Select
              value={formData.semester}
              onValueChange={(value) =>
                setFormData({ ...formData, semester: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="harmattan">Harmattan</SelectItem>
                <SelectItem value="rain">Rain</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-semibold text-black">Email (Personal)</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your.email@example.com"
              className="mt-1"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 text-black border-gray-300 hover:bg-gray-50 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-black text-white hover:bg-gray-800"
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
