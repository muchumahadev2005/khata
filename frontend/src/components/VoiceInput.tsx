import React from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, FileText } from "lucide-react";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";

interface VoiceInputProps {
  onVoiceCommand: (
    customerName: string,
    amount: number,
    description: string,
    type: "debt" | "payment",
  ) => void;
}

export const VoiceInput = ({ onVoiceCommand }: VoiceInputProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [manualCustomerName, setManualCustomerName] = React.useState("");
  const [manualPhone, setManualPhone] = React.useState("");
  const [manualAmount, setManualAmount] = React.useState("");
  const [manualDescription, setManualDescription] = React.useState("");
  const [manualType, setManualType] = React.useState<"debt" | "payment">(
    "debt",
  );

  const {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    parseVoiceCommand,
    isSupported,
  } = useVoiceRecognition();

  React.useEffect(() => {
    if (transcript && transcript.trim()) {
      const command = parseVoiceCommand(transcript);
      if (command) {
        if (!user) {
          toast({
            title: "Authentication required",
            description: "Please sign in or sign up to add transactions",
            variant: "destructive",
          });
          localStorage.removeItem("token");
          navigate("/login");
          stopListening();
          return;
        }
        onVoiceCommand(
          command.customerName,
          command.amount,
          command.description,
          command.type,
        );
        toast({
          title: "Voice command processed",
          description: `Added ${command.type} of ₹${command.amount} for ${command.customerName}`,
        });
        // Stop listening after successful command
        stopListening();
      } else {
        toast({
          title: "Could not parse command",
          description: "Try saying 'entry John 500 for groceries'",
          variant: "destructive",
        });
        // Stop listening after failed parsing
        stopListening();
      }
    }
  }, [
    transcript,
    parseVoiceCommand,
    onVoiceCommand,
    toast,
    stopListening,
    user,
    navigate,
  ]);

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Voice recognition error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in or sign up to add transactions",
        variant: "destructive",
      });
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    if (
      !manualCustomerName.trim() ||
      !manualPhone.trim() ||
      !manualAmount ||
      !manualDescription.trim()
    ) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields including phone number",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(manualAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }

    onVoiceCommand(
      manualCustomerName.trim(),
      amount,
      manualDescription.trim(),
      manualType,
    );
    toast({
      title: "Manual entry added",
      description: `Added ${manualType} of ₹${amount} for ${manualCustomerName}`,
    });

    // Clear form
    setManualCustomerName("");
    setManualPhone("");
    setManualAmount("");
    setManualDescription("");
    setManualType("debt");
  };

  if (!isSupported) {
    return (
      <Card className="p-6 text-center">
        <Volume2 className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">
          Voice recognition is not supported in this browser
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="voice" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Voice
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Manual
            </TabsTrigger>
          </TabsList>

          <TabsContent value="voice" className="space-y-4">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Say: "entry John 500 for groceries" or "Sarah paid 200 rupees"
              </p>

              <Button
                onClick={isListening ? stopListening : startListening}
                variant={isListening ? "destructive" : "default"}
                size="lg"
                className={`
                  relative h-16 w-16 rounded-full mx-auto
                  ${
                    isListening
                      ? "bg-gradient-to-br from-destructive to-destructive/80 animate-pulse-voice shadow-voice"
                      : "bg-gradient-primary hover:opacity-90"
                  }
                `}
              >
                {isListening ? (
                  <MicOff className="h-6 w-6" />
                ) : (
                  <Mic className="h-6 w-6" />
                )}
              </Button>

              {isListening && (
                <p className="text-sm text-muted-foreground animate-pulse">
                  Listening... Speak now
                </p>
              )}

              {transcript && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium">Last heard:</p>
                  <p className="text-sm text-muted-foreground">{transcript}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="manual" className="space-y-4">
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  placeholder="Enter customer name"
                  value={manualCustomerName}
                  onChange={(e) => setManualCustomerName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="Enter amount"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Enter description"
                  value={manualDescription}
                  onChange={(e) => setManualDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={manualType}
                  onValueChange={(value: "debt" | "payment") =>
                    setManualType(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debt">
                      Debt (Customer owes money)
                    </SelectItem>
                    <SelectItem value="payment">
                      Payment (Customer paid money)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full"
                style={{ backgroundColor: "#38bdf8", color: "#fff" }}
              >
                Add Transaction
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
