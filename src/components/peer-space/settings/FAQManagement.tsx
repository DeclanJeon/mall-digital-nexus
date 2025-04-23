import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Plus } from 'lucide-react';

interface FAQManagementProps {
  onSave: () => void;
}

export const FAQManagement = ({ onSave }: FAQManagementProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>자주 묻는 질문(FAQ) 관리</CardTitle>
        <CardDescription>
          자주 묻는 질문과 답변을 등록하고 관리합니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="question1">
            <AccordionTrigger className="text-md font-medium">
              배송은 얼마나 걸리나요?
            </AccordionTrigger>
            <AccordionContent>
              배송은 결제 완료 후 2~3일 정도 소요됩니다.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="question2">
            <AccordionTrigger className="text-md font-medium">
              교환/환불 정책은 어떻게 되나요?
            </AccordionTrigger>
            <AccordionContent>
              제품에 하자가 있는 경우, 수령 후 7일 이내에 교환/환불이 가능합니다.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button variant="outline" className="w-full mt-4">
          <Plus className="mr-2 h-4 w-4" /> FAQ 추가
        </Button>
        <div className="flex justify-end mt-4">
          <Button onClick={onSave}>저장</Button>
        </div>
      </CardContent>
    </Card>
  );
};
