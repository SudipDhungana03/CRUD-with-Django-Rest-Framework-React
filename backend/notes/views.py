from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import NoteSerializer
from .models import Note

class NoteListAPIView(APIView):
    def get(self, request):
        notes = Note.objects.all()
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Note added successfully!',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NoteDetailAPIView(APIView):
    def get_object(self, pk):
        try:
            return Note.objects.get(pk=pk)
        except Note.DoesNotExist:
            return None

    def get(self, request, pk):
        note = self.get_object(pk)
        if not note:
            return Response({'error': 'Note not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = NoteSerializer(note)
        return Response(serializer.data)

    def put(self, request, pk):
        note = self.get_object(pk)
        if not note:
            return Response({'error': 'Note not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = NoteSerializer(note, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Note updated successfully!', 'data': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        note = self.get_object(pk)
        if not note:
            return Response({'error': 'Note not found'}, status=status.HTTP_404_NOT_FOUND)
        note.delete()
        return Response({'message': 'Note deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)
