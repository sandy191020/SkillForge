import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Briefcase, ChevronRight, Code, Database, Brain, Shield, Layers, Sparkles } from 'lucide-react'

interface SetupFormProps {
    onStart: (role: string, level: string) => void
}

const ROLES = [
    { name: 'Full-Stack', icon: Layers, color: 'text-blue-600' },
    { name: 'Backend', icon: Database, color: 'text-green-600' },
    { name: 'Frontend', icon: Code, color: 'text-purple-600' },
    { name: 'Data Analyst', icon: Brain, color: 'text-orange-600' },
    { name: 'ML Engineer', icon: Sparkles, color: 'text-pink-600' },
    { name: 'Cybersecurity', icon: Shield, color: 'text-red-600' },
]

export default function SetupForm({ onStart }: SetupFormProps) {
    const [step, setStep] = useState<'role' | 'level'>('role')
    const [selectedRole, setSelectedRole] = useState('')
    const [customRole, setCustomRole] = useState('')
    const [isCustom, setIsCustom] = useState(false)
    const [selectedLevel, setSelectedLevel] = useState('')

    const handleRoleNext = () => {
        const role = isCustom ? customRole : selectedRole
        if (role.trim()) {
            setStep('level')
        }
    }

    const handleStart = () => {
        const role = isCustom ? customRole : selectedRole
        if (role.trim() && selectedLevel) {
            onStart(role, selectedLevel)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh] p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-3xl flex items-center gap-2">
                        <Briefcase className="w-8 h-8 text-blue-600" />
                        Interview Setup
                    </CardTitle>
                    <CardDescription className="text-base">
                        {step === 'role' 
                            ? 'Which role are you preparing for?' 
                            : 'Are you targeting a fresh/entry-level or senior-level interview?'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 'role' ? (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Select Role</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {ROLES.map((role) => {
                                        const Icon = role.icon
                                        return (
                                            <button
                                                key={role.name}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedRole(role.name)
                                                    setIsCustom(false)
                                                }}
                                                className={`p-4 text-left rounded-xl border-2 transition-all hover:scale-105 ${
                                                    !isCustom && selectedRole === role.name
                                                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                                                        : 'hover:bg-muted border-border'
                                                }`}
                                            >
                                                <Icon className={`w-6 h-6 mb-2 ${role.color}`} />
                                                <div className="font-medium">{role.name}</div>
                                            </button>
                                        )
                                    })}
                                    <button
                                        type="button"
                                        onClick={() => setIsCustom(true)}
                                        className={`p-4 text-left rounded-xl border-2 transition-all hover:scale-105 ${
                                            isCustom
                                                ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                                                : 'hover:bg-muted border-border'
                                        }`}
                                    >
                                        <Sparkles className="w-6 h-6 mb-2 text-gray-600" />
                                        <div className="font-medium">Custom</div>
                                    </button>
                                </div>
                            </div>

                            {isCustom && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Enter Custom Role</label>
                                    <Input
                                        value={customRole}
                                        onChange={(e) => setCustomRole(e.target.value)}
                                        placeholder="e.g., DevOps Engineer, Product Manager"
                                        autoFocus
                                        className="text-base"
                                    />
                                </div>
                            )}

                            <Button
                                onClick={handleRoleNext}
                                className="w-full text-base py-6"
                                size="lg"
                                disabled={(!isCustom && !selectedRole) || (isCustom && !customRole.trim())}
                            >
                                Next: Select Level
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <label className="text-sm font-medium">Select Experience Level</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedLevel('Fresh')}
                                        className={`p-6 text-left rounded-xl border-2 transition-all hover:scale-105 ${
                                            selectedLevel === 'Fresh'
                                                ? 'bg-green-50 border-green-500 ring-2 ring-green-200'
                                                : 'hover:bg-muted border-border'
                                        }`}
                                    >
                                        <div className="text-2xl mb-2">🌱</div>
                                        <div className="font-bold text-lg mb-1">Fresh / Entry-Level</div>
                                        <div className="text-sm text-muted-foreground">
                                            Basic concepts, fundamentals, and moderate questions
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedLevel('Senior')}
                                        className={`p-6 text-left rounded-xl border-2 transition-all hover:scale-105 ${
                                            selectedLevel === 'Senior'
                                                ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-200'
                                                : 'hover:bg-muted border-border'
                                        }`}
                                    >
                                        <div className="text-2xl mb-2">🚀</div>
                                        <div className="font-bold text-lg mb-1">Senior Level</div>
                                        <div className="text-sm text-muted-foreground">
                                            Architecture, real-world scenarios, and debugging
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={() => setStep('role')}
                                    variant="outline"
                                    className="flex-1 text-base py-6"
                                    size="lg"
                                >
                                    Back
                                </Button>
                                <Button
                                    onClick={handleStart}
                                    className="flex-1 text-base py-6"
                                    size="lg"
                                    disabled={!selectedLevel}
                                >
                                    Start Interview
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
