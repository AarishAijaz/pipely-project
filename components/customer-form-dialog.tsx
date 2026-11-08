"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSpeech } from "@/lib/use-speech";
import { parseSpokenEmail, parseSpokenPhone, parseSpokenStatus } from "@/lib/voice-parsing";

export type Customer = {
  id: number;
  created_at?: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "Lead" | "Active" | "Churned";
};

// Must start with 0 and be exactly 11 digits total, no other characters.
// e.g. "03001234567"
const PHONE_PATTERN = "^0[0-9]{10}$";
const PHONE_REGEX = new RegExp(PHONE_PATTERN);

export function CustomerFormDialog({
  open,
  onOpenChange,
  onSave,
  editingCustomer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (customer: Omit<Customer, "id">) => void;
  editingCustomer: Customer | null;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<Customer["status"]>("Lead");

  const speech = useSpeech();
  const [voicePrompt, setVoicePrompt] = useState("");
  const [voiceRunning, setVoiceRunning] = useState(false);
  const cancelledRef = useRef(false);
  const hasAutoStartedRef = useRef(false);

  useEffect(() => {
    if (editingCustomer) {
      setName(editingCustomer.name);
      setEmail(editingCustomer.email);
      setPhone(editingCustomer.phone ?? "");
      setCompany(editingCustomer.company);
      setStatus(editingCustomer.status);
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setStatus("Lead");
    }
  }, [editingCustomer, open]);

  useEffect(() => {
    if (open && !editingCustomer && speech.supported) {
      if (!hasAutoStartedRef.current) {
        hasAutoStartedRef.current = true;
        runVoiceIntake();
      }
    } else {
      hasAutoStartedRef.current = false;
    }
    if (!open) {
      cancelledRef.current = true;
      speech.stop();
      setVoiceRunning(false);
      setVoicePrompt("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editingCustomer]);

  function trySave(data: {
    name: string;
    email: string;
    phone: string;
    company: string;
    status: Customer["status"];
  }) {
    if (!data.name.trim() || !data.email.trim() || !data.phone.trim() || !data.company.trim()) return;
    onSave(data);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    trySave({ name, email, phone, company, status });
  }

  function stopVoice() {
    cancelledRef.current = true;
    speech.stop();
    setVoiceRunning(false);
    setVoicePrompt("");
  }

  async function runVoiceIntake() {
    cancelledRef.current = false;
    setVoiceRunning(true);

    async function ask(prompt: string) {
      setVoicePrompt(prompt);
      await speech.speak(prompt);
      if (cancelledRef.current) return "";
      return speech.listen();
    }

    async function askWithRetry(prompt: string, retryPrompt: string) {
      const heard = await ask(prompt);
      if (cancelledRef.current || heard.trim()) return heard;
      return ask(retryPrompt);
    }

    const nameHeard = await askWithRetry(
      "Let's add a new customer. What is their name?",
      "Sorry, I didn't catch that. Please say the customer's name."
    );
    if (cancelledRef.current) return setVoiceRunning(false);
    const collectedName = nameHeard.trim();
    setName(collectedName);

    const emailHeard = await askWithRetry(
      `Got it${collectedName ? ", " + collectedName : ""}. What is their email address?`,
      "Sorry, I didn't catch the email. Please say it again, for example jane at company dot com."
    );
    if (cancelledRef.current) return setVoiceRunning(false);
    const collectedEmail = parseSpokenEmail(emailHeard);
    setEmail(collectedEmail);

    const phoneHeard = await askWithRetry(
      "Next, what is their phone number?",
      "Sorry, I didn't catch that. Please say the phone number again."
    );
    if (cancelledRef.current) return setVoiceRunning(false);
    const collectedPhone = parseSpokenPhone(phoneHeard);
    setPhone(collectedPhone);

    const companyHeard = await askWithRetry(
      "What company do they work for?",
      "Sorry, I didn't catch the company name. Please say it again."
    );
    if (cancelledRef.current) return setVoiceRunning(false);
    const collectedCompany = companyHeard.trim();
    setCompany(collectedCompany);

    // Status is a closed set, so retry with an explicit list instead of free text.
    let parsedStatus: Customer["status"] | null = null;
    for (let attempt = 0; attempt < 2 && !parsedStatus && !cancelledRef.current; attempt++) {
      const prompt =
        attempt === 0
          ? "And what is their status? Say lead, active, or churned."
          : "Sorry, I need one of: lead, active, or churned. Which one is it?";
      parsedStatus = parseSpokenStatus(await ask(prompt));
    }
    if (cancelledRef.current) return setVoiceRunning(false);
    const collectedStatus = parsedStatus ?? "Lead";
    setStatus(collectedStatus);

    const isValid =
      collectedName.length > 0 &&
      collectedEmail.includes("@") &&
      PHONE_REGEX.test(collectedPhone) &&
      collectedCompany.length > 0;

    if (!isValid) {
      const note = "I've filled in what I could hear. Please review and correct any fields, then click Add Customer.";
      setVoicePrompt(note);
      await speech.speak(note);
      setVoiceRunning(false);
      return;
    }

    const confirmHeard = await ask(
      `Here's what I have: name ${collectedName}, email ${collectedEmail}, phone ${collectedPhone}, company ${collectedCompany}, status ${collectedStatus}. Say yes to save, or no to review it yourself.`
    );
    if (cancelledRef.current) return setVoiceRunning(false);

    setVoiceRunning(false);
    if (/\b(yes|yeah|yep|correct|confirm|save)\b/i.test(confirmHeard)) {
      setVoicePrompt("Saved!");
      trySave({
        name: collectedName,
        email: collectedEmail,
        phone: collectedPhone,
        company: collectedCompany,
        status: collectedStatus,
      });
    } else {
      setVoicePrompt("Okay — the form is filled in. Edit anything you need, then click Add Customer.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingCustomer ? "Edit Customer" : "Add Customer"}</DialogTitle>
        </DialogHeader>
        {!editingCustomer && (
          <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/40 p-3 text-sm">
            {speech.supported ? (
              <>
                <div className="flex items-center gap-2 text-muted-foreground">
                  {speech.status === "listening" ? (
                    <Mic className="h-4 w-4 shrink-0 animate-pulse text-primary" />
                  ) : speech.status === "speaking" ? (
                    <Volume2 className="h-4 w-4 shrink-0 animate-pulse text-primary" />
                  ) : (
                    <Mic className="h-4 w-4 shrink-0" />
                  )}
                  <span>{voicePrompt || "Starting voice input…"}</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={voiceRunning ? stopVoice : () => runVoiceIntake()}
                  className="shrink-0"
                >
                  {voiceRunning ? (
                    <>
                      <MicOff className="mr-1 h-3.5 w-3.5" /> Stop
                    </>
                  ) : (
                    <>
                      <Mic className="mr-1 h-3.5 w-3.5" /> Restart Voice
                    </>
                  )}
                </Button>
              </>
            ) : (
              <span className="text-muted-foreground">
                Voice input isn&apos;t supported in this browser — try Chrome or Edge, or fill the form in manually.
              </span>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Cooper" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@company.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03001234567"
              pattern={PHONE_PATTERN}
              title="Enter a valid phone number: 11 digits, starting with 0 (e.g. 03001234567)"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="company">Company</Label>
            <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Inc." required />
          </div>
          <div className="grid gap-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as Customer["status"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Lead">Lead</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Churned">Churned</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingCustomer ? "Save Changes" : "Add Customer"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}