import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ModelHelpDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const models = [
  { name: "chirp-v3-5", version: "3.5" },
  { name: "chirp-v4", version: "4" },
  { name: "chirp-auk", version: "4.5" },
  { name: "chirp-bluejay", version: "4.5+" },
  { name: "chirp-crow", version: "5" },
];

export function ModelHelpDialog({ isOpen, onOpenChange }: ModelHelpDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How to select model? / 如何选择模型？</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">How to select model?</p>
            <p className="text-sm text-muted-foreground">
              Suno updates their model regularly. To make it simple, newer the version, better the results.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">如何选择模型？</p>
            <p className="text-sm text-muted-foreground">
              Suno会定期更新提供的模型。简单来说，版本越新的模型效果越好。
            </p>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">Reference table:</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>Version</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.map((model) => (
                  <TableRow key={model.name}>
                    <TableCell className="font-mono text-xs">{model.name}</TableCell>
                    <TableCell>{model.version}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}